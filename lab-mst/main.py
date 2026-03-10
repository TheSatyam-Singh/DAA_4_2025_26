class Solution:
    def maxOfSubarrays(self, arr, k):
        dq = []
        ans = []

        for i in range(len(arr)):
            if dq and dq[0] == i - k:
                dq.pop(0)

            while dq and arr[dq[-1]] < arr[i]:
                dq.pop()

            dq.append(i)
            if i >= k - 1:
                ans.append(arr[dq[0]])

        return ans
