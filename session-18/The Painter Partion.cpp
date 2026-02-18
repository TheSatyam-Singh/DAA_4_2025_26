#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

class Solution {
  public:
    bool isPossible(vector<int> &boards, int k, long long mid) {
        int painterCount = 1;
        long long boardSum = 0;

        for (int i = 0; i < boards.size(); i++) {
            if (boardSum + boards[i] <= mid) {
                boardSum += boards[i];
            } else {
                painterCount++;
                if (painterCount > k || boards[i] > mid) {
                    return false;
                }
                boardSum = boards[i];
            }
        }
        return true;
    }

    long long minTime(vector<int>& arr, int k) {
        long long s = 0;
        long long sum = 0;
        for (int i = 0; i < arr.size(); i++) {
            sum += arr[i];
        }
        long long e = sum;
        long long ans = -1;
        long long mid = s + (e - s) / 2;

        while (s <= e) {
            if (isPossible(arr, k, mid)) {
                ans = mid;
                e = mid - 1;
            } else {
                s = mid + 1;
            }
            mid = s + (e - s) / 2;
        }
        return ans;
    }
};

int main() {
    Solution sol;
    vector<int> arr = {5, 10, 30, 20, 15};
    int k = 3;
    cout << sol.minTime(arr, k) << endl;
    return 0;
}
