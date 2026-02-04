#include <bits/stdc++.h>
using namespace std;

int main() {
    int k, n;
    cin >> k >> n;

    priority_queue<int, vector<int>, greater<int>> queue;

    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;

        if (queue.size() < k) {
            queue.push(x);
        } else if (x > queue.top()) {
            queue.pop();
            queue.push(x);
        }

        if (queue.size() < k) {
            cout << -1 << " ";
        } else {
            cout << queue.top() << " ";
        }
    }
    return 0;
}
