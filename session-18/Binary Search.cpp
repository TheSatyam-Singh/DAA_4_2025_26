#include<iostream>
using namespace std;

int main() {
    int arr[] = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
    int n = sizeof(arr) / sizeof(arr[0]);
    int key = 5;
    int low = 0;
    int high = n - 1;
    bool found = false;

    int mid = -1;
    while (low <= high) {
        mid = low + (high - low) / 2;
        
        if (arr[mid] == key) {
            found = true;
            break;
        }
        else if (arr[mid] < key) {
            low = mid + 1;
        }
        else {
            high = mid - 1;
        }
    }
    if (found) {
        cout << "Element found at index: " << mid << endl;
    }
    else {
        cout << "Element not found in the array." << endl;
    }
    return 0;
}
