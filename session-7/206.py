# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        temp=ListNode()
        curr=head
        while curr is not None:
            next=curr.next
            curr.next=temp.next
            temp.next=curr
            curr=next
        return temp.next
