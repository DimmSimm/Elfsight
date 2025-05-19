import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

const STATUS_OPTIONS = ['Alive', 'Dead', 'unknown'];
const GENDER_OPTIONS = ['Female', 'Male', 'Genderless', 'unknown'];

const initialFilterState = {
  Status: '',
  Gender: '',
  Species: '',
  text1: '',
  text2: ''
};

export const FilterForm = ({ onApply }) => {
  const [filters, setFilters] = useState(initialFilterState);
  const [openMenu, setOpenMenu] = useState(null); // 'Status' | 'Gender' | 'Species' | null
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [loadingSpecies, setLoadingSpecies] = useState(true);

  // Получение всех уникальных species (можно ограничить количество страниц для скорости)
  useEffect(() => {
    let cancelled = false;
    async function fetchSpecies() {
      setLoadingSpecies(true);
      const speciesSet = new Set();
      let page = 1;
      let totalPages = 2; // Можно увеличить до 10 для большего охвата

      try {
        // Получаем первую страницу, чтобы узнать totalPages
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/?page=1`
        );
        totalPages = Math.min(data.info.pages, 10);

        // Собираем species с первых totalPages страниц
        for (page = 1; page <= totalPages; page++) {
          const { data } = await axios.get(
            `https://rickandmortyapi.com/api/character/?page=${page}`
          );
          data.results.forEach((char) => speciesSet.add(char.species));
        }
        if (!cancelled) {
          setSpeciesOptions(Array.from(speciesSet).sort());
        }
      } catch (err) {
        if (!cancelled) setSpeciesOptions([]);
      } finally {
        if (!cancelled) setLoadingSpecies(false);
      }
    }
    fetchSpecies();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleMenu = useCallback(
    (menuName) => () =>
      setOpenMenu((prev) => (prev === menuName ? null : menuName)),
    []
  );

  const selectOption = useCallback(
    (category, option) => () => {
      setFilters((prev) => ({ ...prev, [category]: option }));
      setOpenMenu(null);
    },
    []
  );

  // Закрытие меню при клике вне формы
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = useCallback(() => {
    setFilters(initialFilterState);
    setOpenMenu(null);
    if (onApply) onApply(initialFilterState);
  }, [onApply]);

  const handleInputChange = useCallback(
    (e) => () => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleApply = useCallback(
    (e) => () => {
      e.preventDefault();
      if (onApply) onApply(filters);
    },
    [onApply, filters]
  );

  return (
    <form style={styles.container} onSubmit={handleApply}>
      <div style={styles.topButtons}>
        {[
          { label: 'Status', options: STATUS_OPTIONS },
          { label: 'Gender', options: GENDER_OPTIONS },
          { label: 'Species', options: speciesOptions }
        ].map(({ label, options }) => (
          <div key={label} style={{ position: 'relative', flex: '1 1' }}>
            <button
              type="button"
              onClick={toggleMenu(label)}
              style={styles.filterButton}
              aria-haspopup="true"
              aria-expanded={openMenu === label}
              disabled={label === 'Species' && loadingSpecies}
            >
              {label}: {filters[label] || 'All'} ▼
            </button>
            {openMenu === label && (
              <ul ref={menuRef} style={styles.menu}>
                <li
                  key="All"
                  style={{
                    ...styles.menuItem,
                    backgroundColor: !filters[label] ? '#e0e0e0' : 'white'
                  }}
                  onClick={selectOption(label, '')}
                >
                  All
                </li>
                {(options || []).map((option) => (
                  <li
                    key={option}
                    style={{
                      ...styles.menuItem,
                      backgroundColor:
                        filters[label] === option ? '#e0e0e0' : 'white'
                    }}
                    onClick={selectOption(label, option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div style={styles.bottomWrapper}>
        <div style={styles.textInputs}>
          <input
            type="text"
            name="text1"
            placeholder="Text input 1"
            style={styles.input}
            value={filters.text1}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="text2"
            placeholder="Text input 2"
            style={styles.input}
            value={filters.text2}
            onChange={handleInputChange}
          />
        </div>
        <div style={styles.bottomButtons}>
          <button
            type="submit"
            style={{ ...styles.actionButton, backgroundColor: '#4CAF50' }}
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{ ...styles.actionButton, backgroundColor: '#f44336' }}
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    fontFamily: 'Arial, sans-serif',
    userSelect: 'none',
    gap: '10px',
    width: '490px'
  },
  topButtons: {
    display: 'flex',
    gap: '10px',
    width: '100%'
  },
  filterButton: {
    display: 'flex',
    padding: '8px 12px',
    fontSize: 14,
    cursor: 'pointer',
    borderRadius: 4,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    width: '150px'
  },
  menu: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    width: 150,
    maxHeight: 120,
    overflowY: 'auto',
    border: '1px solid #ccc',
    borderRadius: 4,
    backgroundColor: 'white',
    zIndex: 1000,
    padding: 0,
    margin: 0,
    listStyle: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  menuItem: {
    padding: '8px 12px',
    cursor: 'pointer'
  },
  bottomWrapper: {
    display: 'flex',
    gap: '10px'
  },
  textInputs: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: '1px solid #ccc',
    width: '150px'
  },
  bottomButtons: {
    display: 'flex',
    gap: '10px'
  },
  actionButton: {
    display: 'flex',
    width: '70px',
    maxWidth: '65%',
    padding: '10px 10px',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  }
};
