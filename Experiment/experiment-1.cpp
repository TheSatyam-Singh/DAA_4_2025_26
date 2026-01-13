#include <bits/stdc++.h>

using namespace std;
using namespace std::chrono;

void complexRec(int n) {
    if (n <= 2) {
        return;
    }

    int p = n;
    while (p > 0) {
        vector < int > temp(n);
        for (int i = 0; i < n; i++) {
            temp[i] = i ^ p;
        }
        p >>= 1;
    }

    vector < int > small(n);
    for (int i = 0; i < n; i++) {
        small[i] = i * i;
    }

    if (n % 3 == 0) {
        reverse(small.begin(), small.end());
    } else {
        reverse(small.begin(), small.end());
    }

    complexRec(n / 2);
    complexRec(n / 2);
    complexRec(n / 2);
}

int main() {
    auto start = high_resolution_clock::now();
    int count=0; 
    complexRec(2000);

    auto end = high_resolution_clock::now();
    auto duration = duration_cast < milliseconds > (end - start);

    cout << duration.count() << " ms"
    return 0;
}