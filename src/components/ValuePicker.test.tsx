import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { facetOptions } from '../lib/movies';
import ValuePicker from './ValuePicker';

// Amy appears in 3 movies, Cat in 2 and Bob in 1, which is the order they are suggested in
const options = facetOptions([['Amy', 'Bob'], ['Amy'], ['Cat'], ['Amy', 'Cat']]);

function setup(selected: string[] = []) {
  const onAdd = jest.fn();
  const onRemove = jest.fn();
  let tree!: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(
      <ValuePicker options={options} selected={selected} label='Stars' onAdd={onAdd} onRemove={onRemove} />
    );
  });

  const input = () => tree.root.findByType('input');
  const optionNodes = () => tree.root.findAll((n) => n.type === 'div' && n.props.role === 'option');
  return {
    onAdd,
    onRemove,
    press: (key: string) => act(() => input().props.onKeyDown({ key, preventDefault() {} })),
    type: (value: string) => act(() => input().props.onChange({ target: { value } })),
    focus: () => act(() => input().props.onFocus()),
    listed: () => optionNodes().map((n) => n.findByProps({ className: 'valueOptionText' }).props.title),
    highlighted: () => optionNodes().find((n) => n.props['aria-selected'])?.findByProps({ className: 'valueOptionText' }).props.title,
  };
}

describe('ValuePicker keyboard navigation', () => {
  test('switches the filter input prompt to search when its data is loaded', () => {
    let tree!: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <ValuePicker
          options={null}
          optionsAvailable
          selected={[]}
          label='Cast'
          placeholder='Search cast…'
          onAdd={jest.fn()}
          onRemove={jest.fn()}
        />
      );
    });

    expect(tree.root.findByType('input').props.placeholder).toBe('Search cast…');

    act(() => {
      tree.update(
        <ValuePicker
          options={options}
          optionsAvailable
          selected={[]}
          label='Cast'
          placeholder='Search cast…'
          onAdd={jest.fn()}
          onRemove={jest.fn()}
        />
      );
    });

    expect(tree.root.findByType('input').props.placeholder).toBe('Search cast…');
  });

  test('arrow keys open the list and move through the options, wrapping at both ends', () => {
    const picker = setup();
    expect(picker.listed()).toEqual([]);

    picker.press('ArrowDown');
    expect(picker.listed()).toEqual(['Amy', 'Cat', 'Bob']);
    expect(picker.highlighted()).toBe('Amy');

    picker.press('ArrowDown');
    expect(picker.highlighted()).toBe('Cat');
    picker.press('ArrowDown');
    picker.press('ArrowDown');
    expect(picker.highlighted()).toBe('Amy');

    picker.press('ArrowUp');
    expect(picker.highlighted()).toBe('Bob');
  });

  test('Enter adds the highlighted option and does nothing when none is highlighted', () => {
    const picker = setup();
    picker.focus();
    picker.press('Enter');
    expect(picker.onAdd).not.toHaveBeenCalled();

    picker.press('ArrowDown');
    picker.press('ArrowDown');
    picker.press('Enter');
    expect(picker.onAdd).toHaveBeenCalledWith('Cat');
  });

  test('typing highlights the best match so Enter adds it', () => {
    const picker = setup();
    picker.type('b');
    expect(picker.listed()).toEqual(['Bob']);
    expect(picker.highlighted()).toBe('Bob');

    picker.press('Enter');
    expect(picker.onAdd).toHaveBeenCalledWith('Bob');
  });

  test('Escape closes the list and Backspace on an empty input removes the last value', () => {
    const picker = setup(['Amy', 'Bob']);
    picker.focus();
    expect(picker.listed()).toEqual(['Cat']);

    picker.press('Escape');
    expect(picker.listed()).toEqual([]);

    picker.press('Backspace');
    expect(picker.onRemove).toHaveBeenCalledWith('Bob');
  });
});
