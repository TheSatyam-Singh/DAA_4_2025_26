#include<iostream>
using namespace std;

int main()
{
    int arr[]={1,1,3,5,6};
    int arr2[]={1,1,2,3,9};
    int n=sizeof(arr)/sizeof(arr[0]);
    int key=6;
    int i=0;
    int j =n-1;
    int count =0;
    while(i<n && j>=0)
    {
        int sum=arr[i]+arr2[j];
        if(sum==key)
        {
            count++;
            j--;
        }
        else if(sum<key)
        {
            i++;
        }
        else
        {
            j--;
        }
    }
    cout<<"Count of pairs with sum "<<key<<" is: "<<count<<endl;
}
