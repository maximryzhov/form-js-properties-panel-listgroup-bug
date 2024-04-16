import { get, set } from 'min-dash';

/*
 * Import components and utilities from our extension API. Warning: for demo experiments only.
 */
import {
  NumberFieldEntry,
  isNumberFieldEntryEdited,
  ListGroup
} from '@bpmn-io/properties-panel';
import { useState } from 'react';

/*
 * This is a custom properties provider for the properties panel.
 * It adds a new group `Range` with range specific properties.
 */
export class CustomPropertiesProvider {
  constructor(propertiesPanel) {
    propertiesPanel.registerProvider(this, 500);
  }

  /**
   * Return the groups provided for the given field.
   *
   * @param {any} field
   * @param {function} editField
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  getGroups(field, editField) {

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return (groups) => {

      if (field.type !== 'range') {
        return groups;
      }

      const generalIdx = findGroupIdx(groups, 'general');

      /* insert range group after general */
      groups.splice(generalIdx + 1, 0, {
        id: 'range',
        label: 'Range',
        entries: RangeEntries(field, editField)
      });

      /* insert listgroup after general */
      const id = 'list-group';
      groups.splice(generalIdx + 1, 0, {
        id: id,
        label: 'ListGroup',
        ...TestListGroupEntry({ id })
      });

      return groups;
    };
  }
}

CustomPropertiesProvider.$inject = ['propertiesPanel'];

/*
 * collect range entries for our custom group
 */
function RangeEntries(field, editField) {

  const onChange = (key) => {
    return (value) => {
      const range = get(field, ['range'], {});

      editField(field, ['range'], set(range, [key], value));
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, ['range', key]);
    };
  };

  return [

    {
      id: 'range-min',
      component: Min,
      getValue,
      field,
      isEdited: isNumberFieldEntryEdited,
      onChange
    },
    {
      id: 'range-max',
      component: Max,
      getValue,
      field,
      isEdited: isNumberFieldEntryEdited,
      onChange
    },
    {
      id: 'range-step',
      component: Step,
      getValue,
      field,
      isEdited: isNumberFieldEntryEdited,
      onChange
    }
  ];

}

function Min(props) {
  const {
    field,
    getValue,
    id,
    onChange
  } = props;

  const debounce = (fn) => fn;

  return NumberFieldEntry({
    debounce,
    element: field,
    getValue: getValue('min'),
    id,
    label: 'Minimum',
    setValue: onChange('min')
  });
}

function Max(props) {
  const {
    field,
    getValue,
    id,
    onChange
  } = props;

  const debounce = (fn) => fn;

  return NumberFieldEntry({
    debounce,
    element: field,
    getValue: getValue('max'),
    id,
    label: 'Maximum',
    setValue: onChange('max')
  });
}

function Step(props) {
  const {
    field,
    getValue,
    id,
    onChange
  } = props;

  const debounce = (fn) => fn;

  return NumberFieldEntry({
    debounce,
    element: field,
    getValue: getValue('step'),
    id,
    min: 0,
    label: 'Step',
    setValue: onChange('step')
  });
}

// helper //////////////////////

function findGroupIdx(groups, id) {
  return groups.findIndex(g => g.id === id);
}

// TestListGroupEntry
function TestListGroupEntry({ id }) {
  const [items, setItems] = useState([]);
  return {
    component: ListGroup,
    add: () => {
      setItems([...items, id + '-item-' + items.length])
    },
    items: items.map(item => ({ id: item, label: item, remove: () => { 
      setItems([...items.slice(1)])
    } })),
    shouldSort: false
  }
}