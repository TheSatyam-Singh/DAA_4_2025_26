class Solution {
  public:
    vector<int> maxOfSubarrays(vector<int>& arr, int k) {
        // code here
        int n=arr.size();
        vector<int> ans;
        
        for (int i=0;i<=n-k;i++){
            int mx=arr[i];
            for (int j=i;j<i+k;j++){
                mx=max(mx,arr[j]);
            }
            ans.push_back(mx);
        }
        return ans;
    }
};
