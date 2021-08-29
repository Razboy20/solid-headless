import {
  createContext,
  createEffect,
  createUniqueId,
  onCleanup,
  useContext,
} from 'solid-js';
import {
  Dynamic,
} from 'solid-js/web';
import { JSX } from 'solid-js/jsx-runtime';
import {
  HeadlessSelectOption,
  HeadlessSelectOptionChild,
  HeadlessSelectOptionProps,
  HeadlessSelectRoot,
  HeadlessSelectRootProps,
  useHeadlessSelectChild,
} from '../headless/Select';
import {
  DynamicProps,
  ValidConstructor,
} from '../utils/dynamic-prop';
import { excludeProps } from '../utils/exclude-props';

interface TailwindRadioGroupContext {
  labelID: string;
  descriptionID: string;
}

const TailwindRadioGroupContext = createContext<TailwindRadioGroupContext>();

function useTailwindRadioGroupContext(componentName: string): TailwindRadioGroupContext {
  const context = useContext(TailwindRadioGroupContext);

  if (context) {
    return context;
  }
  throw new Error(`<${componentName}> must be used inside a <TailwindRadioGroup> or <TailwindRadioGroupOption>`);
}

interface TailwindRadioGroupRootContext {
  ownerID: string;
  setChecked: (node: Element) => void;
  setPrevChecked: (node: Element) => void;
  setNextChecked: (node: Element) => void;
}

const TailwindRadioGroupRootContext = createContext<TailwindRadioGroupRootContext>();

function useTailwindRadioGroupRootContext(componentName: string): TailwindRadioGroupRootContext {
  const context = useContext(TailwindRadioGroupRootContext);

  if (context) {
    return context;
  }
  throw new Error(`<${componentName}> must be used inside a <TailwindRadioGroup>`);
}

export type TailwindRadioGroupProps<V, T extends ValidConstructor = 'div'> = {
  as?: T;
} & Omit<HeadlessSelectRootProps<V>, 'type'> & Omit<DynamicProps<T>, 'children' | 'onChange'>;

export function TailwindRadioGroup<V, T extends ValidConstructor = 'div'>(
  props: TailwindRadioGroupProps<V, T>,
): JSX.Element {
  const ownerID = createUniqueId();
  const descriptionID = createUniqueId();
  const labelID = createUniqueId();

  let internalRef: HTMLElement;

  function setChecked(node: Element) {
    (node as HTMLElement).focus();
  }

  function setNextChecked(node: Element) {
    const radios = internalRef.querySelectorAll(`[data-sh-radio="${ownerID}"]`);
    for (let i = 0, len = radios.length; i < len; i += 1) {
      if (node === radios[i]) {
        if (i === len - 1) {
          setChecked(radios[0]);
        } else {
          setChecked(radios[i + 1]);
        }
      }
    }
  }

  function setPrevChecked(node: Element) {
    const radios = internalRef.querySelectorAll(`[data-sh-radio="${ownerID}"]`);
    for (let i = 0, len = radios.length; i < len; i += 1) {
      if (node === radios[i]) {
        if (i === 0) {
          setChecked(radios[len - 1]);
        } else {
          setChecked(radios[i - 1]);
        }
      }
    }
  }

  return (
    <TailwindRadioGroupRootContext.Provider
      value={{
        ownerID,
        setChecked,
        setNextChecked,
        setPrevChecked,
      }}
    >
      <TailwindRadioGroupContext.Provider
        value={{
          descriptionID,
          labelID,
        }}
      >
        <Dynamic
          component={props.as ?? 'div'}
          {...excludeProps(props, [
            'as',
            'children',
            'value',
            'disabled',
          ])}
          role="radiogroup"
          aria-labelledby={labelID}
          aria-describedby={descriptionID}
          ref={(e) => {
            const outerRef = props.ref;
            if (typeof outerRef === 'function') {
              outerRef(e);
            } else {
              props.ref = e;
            }
            internalRef = e;
          }}
          data-sh-radiogroup={ownerID}
        >
          <HeadlessSelectRoot
            value={props.value}
            disabled={props.disabled}
            onChange={props.onChange}
          >
            {props.children}
          </HeadlessSelectRoot>
        </Dynamic>
      </TailwindRadioGroupContext.Provider>
    </TailwindRadioGroupRootContext.Provider>
  );
}

export type TailwindRadioGroupOptionProps<V, T extends ValidConstructor = 'div'> = {
  as?: T;
} & Omit<HeadlessSelectOptionProps<V>, 'multiple'> & Omit<DynamicProps<T>, 'children'>;

export function TailwindRadioGroupOption<V, T extends ValidConstructor = 'div'>(
  props: TailwindRadioGroupOptionProps<V, T>,
): JSX.Element {
  const context = useTailwindRadioGroupRootContext('TailwindRadioGroupOption');
  const properties = useHeadlessSelectChild<V>();

  const descriptionID = createUniqueId();
  const labelID = createUniqueId();

  let internalRef: HTMLElement;

  createEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(properties.disabled() || props.disabled)) {
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            context.setPrevChecked(internalRef);
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            context.setNextChecked(internalRef);
            break;
          case ' ':
          case 'Enter':
            context.setChecked(internalRef);
            break;
          default:
            break;
        }
      }
    };
    const onClick = () => {
      if (!(properties.disabled() || props.disabled)) {
        properties.select(props.value);
      }
    };
    const onFocus = () => {
      if (!(properties.disabled() || props.disabled)) {
        properties.focus(props.value);
        properties.select(props.value);
      }
    };
    const onBlur = () => {
      if (!(properties.disabled() || props.disabled)) {
        properties.blur();
      }
    };

    internalRef.addEventListener('keydown', onKeyDown);
    internalRef.addEventListener('click', onClick);
    internalRef.addEventListener('focus', onFocus);
    internalRef.addEventListener('blur', onBlur);
    onCleanup(() => {
      internalRef.removeEventListener('keydown', onKeyDown);
      internalRef.removeEventListener('click', onClick);
      internalRef.removeEventListener('focus', onFocus);
      internalRef.removeEventListener('blur', onBlur);
    });
  });

  return (
    <TailwindRadioGroupContext.Provider
      value={{
        descriptionID,
        labelID,
      }}
    >
      <HeadlessSelectOption
        value={props.value}
        disabled={props.disabled}
      >
        {(optionProperties) => (
          <Dynamic
            component={props.as ?? 'div'}
            {...excludeProps(props, [
              'as',
              'children',
              'value',
              'disabled',
            ])}
            role="radio"
            aria-checked={optionProperties.isSelected()}
            aria-labelledby={labelID}
            aria-describedby={descriptionID}
            disabled={optionProperties.disabled()}
            tabindex={optionProperties.isSelected() ? 0 : -1}
            ref={(e) => {
              const outerRef = props.ref;
              if (typeof outerRef === 'function') {
                outerRef(e);
              } else {
                props.ref = e;
              }
              internalRef = e;
            }}
            data-sh-radio={context.ownerID}
          >
            <HeadlessSelectOptionChild>
              {props.children}
            </HeadlessSelectOptionChild>
          </Dynamic>
        )}
      </HeadlessSelectOption>
    </TailwindRadioGroupContext.Provider>
  );
}

export type TailwindRadioGroupLabelProps<T extends ValidConstructor = 'label'> = {
  as?: T;
} & Omit<DynamicProps<T>, 'as'>;

export function TailwindRadioGroupLabel<T extends ValidConstructor = 'label'>(
  props: TailwindRadioGroupLabelProps<T>,
): JSX.Element {
  const context = useTailwindRadioGroupContext('TailwindRadioGroupLabel');
  return (
    <Dynamic
      component={props.as ?? 'label'}
      {...excludeProps(props, [
        'as',
      ])}
      id={context.labelID}
    >
      {props.children}
    </Dynamic>
  );
}

export type TailwindRadioGroupDescriptionProps<T extends ValidConstructor = 'div'> = {
  as?: T;
} & Omit<DynamicProps<T>, 'as'>;

export function TailwindRadioGroupDescription<T extends ValidConstructor = 'div'>(
  props: TailwindRadioGroupDescriptionProps<T>,
): JSX.Element {
  const context = useTailwindRadioGroupContext('TailwindRadioGroupLabel');
  return (
    <Dynamic
      component={props.as ?? 'div'}
      {...excludeProps(props, [
        'as',
      ])}
      id={context.descriptionID}
    >
      {props.children}
    </Dynamic>
  );
}
