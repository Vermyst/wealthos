#include <bits/stdc++.h>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

int simulate(vector<double> balances, vector<double> rates, vector<double> payments) {
    int n = (int)balances.size();
    for (int month = 1; month <= 600; month++) {
        bool allDone = true;
        for (int i = 0; i < n; i++) {
            if (balances[i] > 0.01) { allDone = false; break; }
        }
        if (allDone) return month - 1;
        for (int i = 0; i < n; i++) {
            if (balances[i] <= 0.01) continue;
            double monthlyRate = rates[i] / 100.0 / 12.0;
            balances[i] += balances[i] * monthlyRate;
            balances[i] -= payments[i];
            if (balances[i] < 0) balances[i] = 0;
        }
        allDone = true;
        for (int i = 0; i < n; i++) {
            if (balances[i] > 0.01) { allDone = false; break; }
        }
        if (allDone) return month;
    }
    return -1;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string input, line;
    while (getline(cin, line)) input += line;
    json data = json::parse(input);

    double monthlyBudget = data["monthlyBudget"];
    int n = (int)data["debts"].size();

    vector<string> names(n);
    vector<double> remaining(n), rates(n), minPayments(n);

    for (int i = 0; i < n; i++) {
        names[i]       = data["debts"][i]["name"];
        remaining[i]   = data["debts"][i]["remainingAmount"];
        rates[i]       = data["debts"][i]["interestRate"];
        minPayments[i] = data["debts"][i]["minimumPayment"];
    }

    double totalMin = 0;
    for (int i = 0; i < n; i++) totalMin += minPayments[i];
    double extraBudget = max(0.0, monthlyBudget - totalMin);

    // ── STRATEGY 1: Avalanche (highest interest first) ──
    vector<double> avalanche = minPayments;
    {
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) {
            return rates[a] > rates[b];
        });
        double budget = extraBudget;
        for (int idx : order) {
            if (budget <= 0) break;
            double canPay = min(budget, max(0.0, remaining[idx] - minPayments[idx]));
            avalanche[idx] += canPay;
            budget -= canPay;
        }
    }

    // ── STRATEGY 2: Snowball (lowest balance first) ──
    vector<double> snowball = minPayments;
    {
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) {
            return remaining[a] < remaining[b];
        });
        double budget = extraBudget;
        for (int idx : order) {
            if (budget <= 0) break;
            double canPay = min(budget, max(0.0, remaining[idx] - minPayments[idx]));
            snowball[idx] += canPay;
            budget -= canPay;
        }
    }

    // ── STRATEGY 3: DP Optimizer (maximize total interest saved) ──
    // We use a bounded knapsack where:
    //   capacity = extraBudget (in integer rupees)
    //   for each debt i, we can pay anywhere from 0 to maxExtra[i] extra rupees
    //   value of paying x extra rupees on debt i = x * (rate[i]/100/12)  (monthly interest saved)
    // Since items are divisible (we can pay any integer amount), this reduces to:
    //   sort by interest rate descending and greedily fill — same as avalanche.
    // BUT: if two debts have the same rate or we want to account for full payoff bonuses,
    //   we use a proper DP over integer rupees.
    vector<double> optimized = minPayments;
    {
        // Scale to integer rupees, cap at 50000 for performance
        int B = (int)min(extraBudget, 50000.0);

        // maxExtra[i] = max additional rupees we can put on debt i
        vector<int> maxExtra(n);
        for (int i = 0; i < n; i++) {
            maxExtra[i] = (int)max(0.0, floor(remaining[i] - minPayments[i]));
            maxExtra[i] = min(maxExtra[i], B); // cap per debt
        }

        // dp[j] = max interest saved using exactly j extra rupees
        // We use a 1D DP, iterating over debts
        // For each debt, it's an unbounded-style but capped at maxExtra[i]
        vector<double> dp(B + 1, 0.0);
        // Track allocation per debt using 2D choice array
        vector<vector<int>> alloc(n, vector<int>(B + 1, 0));

        // Full 2D DP for traceback
        vector<vector<double>> dpFull(n + 1, vector<double>(B + 1, 0.0));

        for (int i = 0; i < n; i++) {
            double monthlyInterestPerRupee = rates[i] / 100.0 / 12.0;
            for (int j = 0; j <= B; j++) {
                dpFull[i+1][j] = dpFull[i][j]; // pay 0 extra on debt i
                // Try paying 1..maxExtra[i] extra on debt i
                for (int pay = 1; pay <= maxExtra[i] && pay <= j; pay++) {
                    double gain = dpFull[i][j - pay] + pay * monthlyInterestPerRupee;
                    if (gain > dpFull[i+1][j] + 1e-12) {
                        dpFull[i+1][j] = gain;
                    }
                }
            }
        }

        // Traceback: find how much extra to pay each debt
        int rem = B;
        for (int i = n - 1; i >= 0; i--) {
            double monthlyInterestPerRupee = rates[i] / 100.0 / 12.0;
            int bestPay = 0;
            double bestVal = dpFull[i][rem]; // 0 extra
            for (int pay = 1; pay <= maxExtra[i] && pay <= rem; pay++) {
                double val = dpFull[i][rem - pay] + pay * monthlyInterestPerRupee;
                if (val > bestVal + 1e-12) {
                    bestVal = val;
                    bestPay = pay;
                }
            }
            optimized[i] += bestPay;
            rem -= bestPay;
        }
    }

    // Simulate
    int avalMonths  = simulate(remaining, rates, avalanche);
    int snowMonths  = simulate(remaining, rates, snowball);
    int dpMonths    = simulate(remaining, rates, optimized);

    // Output
    json result;
    result["avalanche"]["months"] = avalMonths;
    result["snowball"]["months"]  = snowMonths;
    result["optimized"]["months"] = dpMonths;

    result["avalanche"]["payments"] = json::array();
    result["snowball"]["payments"]  = json::array();
    result["optimized"]["payments"] = json::array();

    for (int i = 0; i < n; i++) {
        result["avalanche"]["payments"].push_back({ {"name", names[i]}, {"payment", (int)round(avalanche[i])} });
        result["snowball"]["payments"].push_back({ {"name", names[i]}, {"payment", (int)round(snowball[i])} });
        result["optimized"]["payments"].push_back({ {"name", names[i]}, {"payment", (int)round(optimized[i])} });
    }

    cout << result.dump() << endl;
    return 0;
}