import { JSX } from 'solid-js';
import { HeadlessToggleRootChildren, HeadlessToggleControlledOptions } from '../../headless/toggle';
import { HeadlessProps, ValidConstructor } from '../../utils/dynamic-prop';
import Fragment from '../../utils/Fragment';
export type CheckboxControlledBaseProps = HeadlessToggleControlledOptions & HeadlessToggleRootChildren;
export type CheckboxControlledProps<T extends ValidConstructor = typeof Fragment> = HeadlessProps<T, CheckboxControlledBaseProps>;
export declare function CheckboxControlled<T extends ValidConstructor = typeof Fragment>(props: CheckboxControlledProps<T>): JSX.Element;
