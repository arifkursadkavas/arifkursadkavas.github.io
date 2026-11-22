import React from 'react';
import renderer, { act } from 'react-test-renderer';
import AutoComplete from './AutoComplete';

describe('AutoComplete', () => {
  test('snapshot renders', async () => {
    let component: renderer.ReactTestRenderer;
    await act(async () => {
      component = renderer.create(<AutoComplete />);
    });
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
