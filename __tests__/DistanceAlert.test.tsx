import React from 'react';
import renderer from 'react-test-renderer';
import { Vibration } from 'react-native';
import DistanceAlert from '../src/components/DistanceAlert';

jest.mock('react-native', () => {
  const React = require('react');

  function MockValue(initialValue: number) {
    this.value = initialValue;
    this.setValue = jest.fn();
  }

  return {
    Animated: {
      Value: MockValue,
      timing: jest.fn(() => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      sequence: jest.fn((animations) => animations),
      loop: jest.fn(() => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      View: React.Fragment,
    },
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    Platform: {
      OS: 'android',
    },
    StyleSheet: {
      create: jest.fn((styles) => styles),
    },
    Vibration: {
      vibrate: jest.fn(),
      cancel: jest.fn(),
    },
  };
});

const mockedVibration = Vibration as unknown as {
  vibrate: jest.Mock;
  cancel: jest.Mock;
};

describe('DistanceAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('vibrates when distance exceeds the default 3 meter limit', () => {
    let tree: renderer.ReactTestRenderer;

    renderer.act(() => {
      tree = renderer.create(<DistanceAlert distanceMeters={3.1} />);
    });

    expect(mockedVibration.vibrate).toHaveBeenCalledWith([1000, 1000, 1000], true);

    renderer.act(() => {
      tree!.unmount();
    });
  });

  it('does not vibrate at the default 3 meter limit', () => {
    let tree: renderer.ReactTestRenderer;

    renderer.act(() => {
      tree = renderer.create(<DistanceAlert distanceMeters={3} />);
    });

    expect(mockedVibration.vibrate).not.toHaveBeenCalled();
    expect(tree!.toJSON()).toBeNull();

    renderer.act(() => {
      tree!.unmount();
    });
  });

  it('does not vibrate when distance is less than 3 meters', () => {
    let tree: renderer.ReactTestRenderer;

    renderer.act(() => {
      tree = renderer.create(<DistanceAlert distanceMeters={2.99} />);
    });

    expect(mockedVibration.vibrate).not.toHaveBeenCalled();

    renderer.act(() => {
      tree!.unmount();
    });
  });
});
