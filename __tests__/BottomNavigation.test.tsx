import React from 'react';
import renderer from 'react-test-renderer';
import BottomNavigation from '../src/components/BottomNavigation';
import MenuScreen from '../src/screens/MenuScreen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('BottomNavigation', () => {
  it('switches between Home and Menu and marks the active tab', () => {
    const onNavigate = jest.fn();
    let screen: renderer.ReactTestRenderer;

    renderer.act(() => {
      screen = renderer.create(
        <BottomNavigation currentScreen="home" onNavigate={onNavigate} />,
      );
    });

    expect(
      screen!.root.findByProps({ accessibilityLabel: 'Home' }).props
        .accessibilityState,
    ).toEqual({ selected: true });

    renderer.act(() => {
      screen!.root.findByProps({ accessibilityLabel: 'Menu' }).props.onPress();
    });

    expect(onNavigate).toHaveBeenCalledWith('menu');

    renderer.act(() => {
      screen!.update(
        <BottomNavigation currentScreen="menu" onNavigate={onNavigate} />,
      );
      screen!.root.findByProps({ accessibilityLabel: 'Home' }).props.onPress();
    });

    expect(onNavigate).toHaveBeenLastCalledWith('home');
  });
});

describe('MenuScreen', () => {
  it('shows the personalized menu introduction and unit preference', () => {
    let screen: renderer.ReactTestRenderer;

    renderer.act(() => {
      screen = renderer.create(
        <MenuScreen
          userName="Alex"
          distanceUnit="meters"
          onDistanceUnitChange={jest.fn()}
        />,
      );
    });

    const tree = JSON.stringify(screen!.toJSON());
    expect(tree).toContain('Hello, Alex.');
    expect(tree).toContain('Distance units');
    expect(tree).not.toContain('ABOUT THE APP');
  });

  it('lets the user select feet in the menu', () => {
    const onDistanceUnitChange = jest.fn();
    let screen: renderer.ReactTestRenderer;

    renderer.act(() => {
      screen = renderer.create(
        <MenuScreen
          distanceUnit="meters"
          onDistanceUnitChange={onDistanceUnitChange}
        />,
      );
    });

    renderer.act(() => {
      screen!.root
        .findByProps({ accessibilityLabel: 'Distance unit Feet' })
        .props.onPress();
    });

    expect(onDistanceUnitChange).toHaveBeenCalledWith('feet');
  });
});
