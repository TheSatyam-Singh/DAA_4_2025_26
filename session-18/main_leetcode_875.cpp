class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int left = 1;
        int right = 0;
        for (int i = 0; i < piles.size(); i++) {
            right = max(right, piles[i]);
        }
        while (left < right) {   
            int mid = (left + right) / 2;
            long long totalHours = 0;
            for (int i = 0; i < piles.size(); i++) {
                if (piles[i] % mid == 0) {
                    totalHours += piles[i] / mid;
                }
                else {
                    totalHours += (piles[i] / mid) + 1;
                }
            }
            if (totalHours > h) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }
        return left;
    }
};
