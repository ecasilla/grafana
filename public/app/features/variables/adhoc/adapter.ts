import cloneDeep from 'lodash/cloneDeep';
import { AdHocVariableModel } from '../../templating/variable';
import { dispatch } from '../../../store/store';
import { VariableAdapter } from '../adapters';
import { AdHocPicker } from '../pickers';
import { adHocVariableReducer, initialAdHocVariableModelState } from './reducer';
import { AdHocVariableEditor } from './AdHocVariableEditor';
import { setFiltersFromUrl } from './actions';
import * as urlParser from './urlParser';

export const createAdHocVariableAdapter = (): VariableAdapter<AdHocVariableModel> => {
  return {
    description: 'Add key/value filters on the fly',
    label: 'Ad hoc filters',
    initialState: initialAdHocVariableModelState,
    reducer: adHocVariableReducer,
    picker: AdHocPicker,
    editor: AdHocVariableEditor,
    dependsOn: () => {
      return false;
    },
    setValue: async () => {},
    setValueFromUrl: async (variable, urlValue) => {
      const filters = urlParser.toFilters(urlValue);
      await dispatch(setFiltersFromUrl(variable.uuid, filters));
    },
    updateOptions: async () => {},
    getSaveModel: variable => {
      const { index, uuid, initLock, global, ...rest } = cloneDeep(variable);
      return rest;
    },
    getValueForUrl: variable => {
      const filters = variable?.filters ?? [];
      return urlParser.toUrl(filters);
    },
  };
};