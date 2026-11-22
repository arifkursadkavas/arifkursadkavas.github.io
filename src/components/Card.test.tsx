import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Card from './Card';

describe('Card', () => {
  test('snapshot renders', async () => {
    let component: renderer.ReactTestRenderer;
    await act(async () => {
      component = renderer.create(<Card description={[]} />);
    });
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
