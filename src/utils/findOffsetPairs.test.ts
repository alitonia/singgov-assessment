import {findOffsetPairs} from "./findOffsetPairs";
import { expect, describe, it } from '@jest/globals';

describe('findOffsetPairs', () => {
    it('should find correct offset pairs for a simple case', () => {
        const mainString = 'Hello world';
        const substring = 'o';
        const result = findOffsetPairs(mainString, substring);
        expect(result).toEqual([
            {BeginOffset: 4, EndOffset: 5},
            {BeginOffset: 7, EndOffset: 8}
        ]);
    });

    it('should be case insensitive', () => {
        const mainString = 'Hello World';
        const substring = 'O';
        const result = findOffsetPairs(mainString, substring);
        expect(result).toEqual([
            {BeginOffset: 4, EndOffset: 5},
            {BeginOffset: 7, EndOffset: 8}
        ]);
    });

    it('should return an empty array if substring is not found', () => {
        const mainString = 'Hello world';
        const substring = 'z';
        const result = findOffsetPairs(mainString, substring);
        expect(result).toEqual([]);
    });

    it('should handle empty main string', () => {
        const mainString = '';
        const substring = 'test';
        const result = findOffsetPairs(mainString, substring);
        expect(result).toEqual([]);
    });

    it('should handle empty substring', () => {
        const mainString = 'Hello world';
        const substring = '';
        const result = findOffsetPairs(mainString, substring);
        expect(result).toEqual([]);
    });

    it('should handle special characters', () => {
        const mainString = 'Hello! How are you?';
        const substring = '!';
        const result = findOffsetPairs(mainString, substring);
        expect(result).toEqual([
            {BeginOffset: 5, EndOffset: 6}
        ]);
    });
});