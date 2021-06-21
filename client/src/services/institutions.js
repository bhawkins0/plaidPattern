import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from 'react';

import { getInstitutionById as apiGetInstitutionById } from './api';

const InstitutionsContext = createContext();

/**
 * @desc Maintains the Institutions context state and provides functions to update that state.
 */
export function InstitutionsProvider(props) {
  const [institutionsById, dispatch] = useReducer(reducer, {});

  /**
   * @desc Requests details for a single Institution.
   */
  const getInstitutionById = useCallback(async id => {
    const { data: payload } = await apiGetInstitutionById(id);
    const institution = payload[0];
    dispatch({ type: 'SUCCESSFUL_GET', payload: institution });
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Institution data. useMemo will prevent
   * these from being rebuilt on every render unless institutionsById is updated in the reducer.
   */
  const value = useMemo(() => {
    const allInstitutions = Object.values(institutionsById);
    return {
      allInstitutions,
      institutionsById,
      getInstitutionById,
      getInstitutionsById: getInstitutionById,
      formatLogoSrc,
    };
  }, [institutionsById, getInstitutionById]);

  return <InstitutionsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Institutions state as dictated by dispatched actions.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (!action.payload) {
        return state;
      }

      return {
        ...state,
        [action.payload.institution_id]: action.payload,
      };
    default:
      console.warn('unknown action: ', action.type, action.payload);
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Institutions context state in components.
 */
export default function useInstitutions() {
  const context = useContext(InstitutionsContext);

  if (!context) {
    throw new Error(
      `useInstitutions must be used within an InstitutionsProvider`
    );
  }

  return context;
}

/**
 * @desc Prepends base64 encoded logo src for use in image tags
 */
function formatLogoSrc(src) {
  return src && `data:image/jpeg;base64,${src}`;
}
