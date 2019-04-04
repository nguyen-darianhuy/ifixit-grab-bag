# ifixit-grab-bag
A tool that uses the iFixit API to allow users to assemble and add a collection of devices they own to their account.

# Built With
**Tech**
- HTML5
- CSS3
- JavaScript ES6

**APIs**
- iFixit API 2.0

# Usage
- Only works on modern browsers

**Finding and adding a device to bag**
1. Use the category tree or the search bar to find your item
2. Click on the item to add it to the bag

**Removing from bag**
1. Click on the item you want to remove, or use the "Clear" button to remove all items.

# Notes about iFixit API 2.0
- */categories/all* contains names of categories & devices, with seemingly no way to distinguish between the two. Also contains duplicate entries.
- */Suggest* also does not distinguish between categories & devices.
- */wikis/CATEGORY?display=hierarchy* is functionally similar to */categories*
- */wikis/{namespace}* has limited functionality (e.g response limit).
