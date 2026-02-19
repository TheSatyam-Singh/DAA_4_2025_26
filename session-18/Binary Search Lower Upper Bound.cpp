#include<iostream>
using namespace std;

int main(){
    int arr[]={1,2,3,4,5,6,6,6,7,7,8,9};
    int n=sizeof(arr)/sizeof(arr[0]);
    int key = 7;

    int low = 0;
    int high = n;
    while(low < high)
    {
        int mid = low + (high - low) / 2;
        if(arr[mid] < key)
            low = mid + 1;
        else
            high = mid;
    }
    cout<<"Lower bound of "<<key<<" is at index: "<<low<<endl;
    low = 0;
    high = n;
    while(low < high)
    {
        int mid = low + (high - low) / 2;
        if(arr[mid] <= key)
            low = mid + 1;
        else
            high = mid;
    }
    cout<<"Upper bound of "<<key<<" is at index: "<<high<<endl;
}
