
/**
 * Stores a list of elements in sorted order
 */
class SortedList {

    constructor() {

        this.list = [];
        this.itemMap = new Map();

    }

    add(newItem) {

        let index = this.list.length;

        this.list.find((item, itemIndex) => {

            if (item < newItem) {
                return false;
            }

            index = itemIndex;
            return true;

        });

        this.list.splice(index, 0, newItem);
        this.itemMap.set(newItem, index);

    }

    delete(item) {

        const index = this.list.indexOf(item);
        this.list.splice(index, 1);
        this.itemMap.delete(item);

    }

    has(item) {

        return this.itemMap.has(item);

    }

    toString() {

        return '' + this.list;

    }

}

module.exports = SortedList;
