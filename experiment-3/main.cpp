#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<char> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    unordered_map<int, int> mp;
    int sum = 0;
    int maxlen = 0;
    mp[0] = -1;
    
    for (int i = 0; i < n; i++) {
        if (arr[i] == 'P')
            sum += 1;
        else if (arr[i] == 'A')
            sum -= 1;
        if (mp.find(sum) != mp.end()) {
            maxlen = max(maxlen, i - mp[sum]);
        } else {
            mp[sum] = i;
        }
    }
    cout << "Max length of attendance: "<< maxlen << endl;
    return 0;
}
