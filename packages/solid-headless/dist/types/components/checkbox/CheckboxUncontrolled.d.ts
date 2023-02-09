import { JSX } from 'solid-js';
import { HeadlessToggleRootChildren, HeadlessToggleUncontrolledOptions } from '../../headless/toggle';
import { HeadlessProps, ValidConstructor } from '../../utils/dynamic-prop';
import Fragment from '../../utils/Fragment';
export type CheckboxUncontrolledBaseProps = HeadlessToggleUncontrolledOptions & HeadlessToggleRootChildren;
export type CheckboxUncontrolledProps<T extends ValidConstructor = typeof Fragment> = HeadlessProps<T, CheckboxUncontrolledBaseProps>;
export declare function CheckboxUncontrolled<T extends ValidConstructor = typeof Fragment>(props: CheckboxUncontrolledProps<T>): JSX.Element;
