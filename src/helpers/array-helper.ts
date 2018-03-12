export class ArrayHelper {

    public static updateArray<T>(oldArray: T[], newArray: T[], uniqueIdentifierAccessor: (item: T) => any): { itemsToAdd: T[], itemsToRemove: T[], itemsToUpdate: T[] } {
        const itemsToRemove: T[] = [];

        if (oldArray) {
            for (const oldItem of oldArray) {
                const newItem: T = newArray.find((x) => uniqueIdentifierAccessor(x) === uniqueIdentifierAccessor(oldItem));

                if (!newItem) {
                    itemsToRemove.push(oldItem);
                }
            }
        }

        const itemsToAdd: T[] = [];

        const itemsToUpdate: T[] = [];

        if (newArray) {
            for (const newItem of newArray) {
                const oldItem: T = oldArray.find((x) => uniqueIdentifierAccessor(x) === uniqueIdentifierAccessor(newItem));

                if (!oldItem) {
                    itemsToAdd.push(newItem);
                } else {
                    itemsToUpdate.push(newItem);
                }
            }
        }

        return {
            itemsToAdd,
            itemsToRemove,
            itemsToUpdate,
        };
    }
}
