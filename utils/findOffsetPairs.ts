// find all start and end index of the substring in the main string
export function findOffsetPairs(mainString: string, substring: string) {
    try {
        const result: number[] = [];
        let index = mainString.toLowerCase().indexOf(substring.toLowerCase());
        let lastIndex = -2

        while (index !== -1) {
            if (index === lastIndex) {
                break
            }
            result.push(index);
            lastIndex = index
            index = mainString.toLowerCase().indexOf(substring.toLowerCase(), index + 1);
        }

        return result.map(id => ({
            BeginOffset: id,
            EndOffset: id + substring.length
        }));
    } catch (error) {
        console.error('Error in findOffsetPairs:', error, "| mainString:", mainString, "| substring:", substring);
        return [];
    }
}