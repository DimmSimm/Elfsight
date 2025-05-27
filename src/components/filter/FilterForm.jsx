import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, fetchCharacters } from '../../slices/charactersSlice';
import styled from 'styled-components';

const STATUS_OPTIONS = ['Alive', 'Dead', 'unknown'];
const GENDER_OPTIONS = ['Female', 'Male', 'Genderless', 'unknown'];
const SPECIES_OPTIONS = [
  'Alien',
  'Animal',
  'Cronenberg',
  'Disease',
  'Human',
  'Humanoid',
  'Mythological Creature',
  'Poopybutthole',
  'Robot',
  'unknown'
];

export const FilterForm = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.characters.filters);
  const totalApiURL = useSelector((state) => state.characters.apiURL);
  const [openMenu, setOpenMenu] = useState(null); // 'Status' | 'Gender' | 'Species' | null

  useEffect(() => {
    dispatch(fetchCharacters(totalApiURL));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMenu = useCallback(
    (menuName) => () =>
      setOpenMenu((prev) => (prev === menuName ? null : menuName)),
    []
  );

  const selectOption = useCallback(
    (label, option) => () => {
      const newFilters = { ...filters, [label]: option };
      setOpenMenu(null);
      dispatch(setFilters(newFilters));
    },
    [dispatch, filters]
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

  const createHandleResetIcon = (label) => {
    return (e) => handleResetIcon(e, label);
  };

  const handleResetIcon = useCallback(
    (e, label) => {
      e.stopPropagation();
      dispatch(setFilters({ ...filters, [label]: '' }));
    },
    [dispatch, filters]
  );

  const handleReset = useCallback(() => {
    const emptyFilters = {
      status: '',
      gender: '',
      species: '',
      name: '',
      type: ''
    };
    dispatch(setFilters(emptyFilters));
    dispatch(
      fetchCharacters('https://rickandmortyapi.com/api/character/?page=1')
    );
  }, [dispatch]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch(setFilters({ ...filters, [name]: value }));
    },
    [dispatch, filters]
  );

  const handleApply = useCallback(() => {
    dispatch(setFilters(filters));
    dispatch(fetchCharacters(totalApiURL));
  }, [dispatch, filters, totalApiURL]);

  return (
    <Container>
      <TopContentWrapper>
        {[
          { label: 'Status', options: STATUS_OPTIONS },
          { label: 'Gender', options: GENDER_OPTIONS },
          { label: 'Species', options: SPECIES_OPTIONS }
        ].map(({ label, options }) => {
          const lowerCasedLabel = label.toLowerCase();

          return (
            <div key={label} style={{ position: 'relative' }}>
              <FilterButton
                type="button"
                onClick={toggleMenu(label)}
                aria-haspopup="true"
                aria-expanded={openMenu === label}
              >
                {!filters[lowerCasedLabel] ? (
                  <LabelContainer>
                    <span>{label}</span>
                    <IconSpan
                      className={`fas ${
                        openMenu === label ? 'fa-chevron-up' : 'fa-chevron-down'
                      }`}
                    >
                      {' '}
                    </IconSpan>
                  </LabelContainer>
                ) : (
                  <LabelContainer active>
                    <span>{filters[lowerCasedLabel]}</span>
                    <IconSpan
                      className={`fas ${
                        openMenu === label ? 'fa-chevron-up' : 'fa-times'
                      }`}
                      onClick={createHandleResetIcon(lowerCasedLabel)}
                    >
                      {' '}
                    </IconSpan>
                  </LabelContainer>
                )}
              </FilterButton>
              {openMenu === label && (
                <UlFilter ref={menuRef}>
                  <LiMenuItem
                    key="All"
                    style={{
                      fontWeight: !filters[lowerCasedLabel] ? 'bold' : 'normal'
                    }}
                    onClick={selectOption(lowerCasedLabel, '')}
                  >
                    All
                  </LiMenuItem>
                  {(options || []).map((option) => (
                    <LiMenuItem
                      key={option}
                      style={{
                        fontWeight:
                          filters[lowerCasedLabel] === option
                            ? 'bold'
                            : 'normal'
                      }}
                      onClick={selectOption(lowerCasedLabel, option)}
                    >
                      {option}
                    </LiMenuItem>
                  ))}
                </UlFilter>
              )}
            </div>
          );
        })}
      </TopContentWrapper>
      <BottomContentWrapper>
        <TextInputsWrapper>
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={filters.name}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="type"
            placeholder="Type"
            value={filters.type}
            onChange={handleInputChange}
          />
        </TextInputsWrapper>
        <BottomButtonsWrapper>
          <ButtonApply type="button" onClick={handleApply}>
            Apply
          </ButtonApply>
          <ButtonReset type="button" onClick={handleReset}>
            Reset
          </ButtonReset>
        </BottomButtonsWrapper>
      </BottomContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  user-select: none;
  gap: 10px;

  @media (max-width: 950px) {
    margin-top: 30px;
    gap: 15px;
  }
`;

const UlFilter = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0px;
  width: 180px;
  max-height: 165px;
  overflow-y: auto;
  border: 2px solid #ccc;
  border-radius: 10px;
  background-color: white;
  z-index: 1000;
  padding: 0px;
  margin: 0px;
  list-style: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  @media (max-width: 950px) {
    width: 150px;
  }

  @media (max-width: 638px) {
    width: 240px;
  }
`;
const LiMenuItem = styled.li`
  padding: 6px 7px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;

  &:hover {
    background-color: #83bf4633;
  }
`;
const TopContentWrapper = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 950px) {
    gap: 15px;
  }

  @media (max-width: 638px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FilterButton = styled.button`
  display: flex;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid #83bf46;
  background-color: #263750;
  width: 180px;
  height: 40px;
  color: #b3b3b3;

  &:hover {
    background-color: #334466;
    color: #fff;
  }

  @media (max-width: 950px) {
    width: 150px;
  }

  @media (max-width: 638px) {
    width: 240px;
  }
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  ${({ active }) => active && 'color: #fff'};
`;

const BottomContentWrapper = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 950px) {
    gap: 15px;
  }

  @media (max-width: 638px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TextInputsWrapper = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 950px) {
    gap: 15px;
  }

  @media (max-width: 638px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
  border: 2px solid #83bf46;
  width: 180px;
  height: 40px;
  background-color: #263750;
  color: #fff;

  &:hover {
    background-color: #334466;
  }

  &::placeholder {
    color: #b3b3b3;
  }

  &:hover::placeholder {
    color: #f5f5f5;
  }

  @media (max-width: 950px) {
    width: 150px;
  }

  @media (max-width: 638px) {
    width: 240px;
  }
`;

const BottomButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 180px;
  gap: 10px;

  @media (max-width: 950px) {
    width: 150px;
  }

  @media (max-width: 638px) {
    flex-direction: column;
    align-items: center;
    justify-content: none;
    width: 240px;
  }
`;

const ButtonApply = styled.button`
  display: flex;
  padding: 12px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  width: 85px;
  height: 40px;
  border: 2px solid #83bf46;
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: #83bf46;
  background-color: #001832;

  &:hover {
    color: #fff;
    background-color: #83bf46;
  }

  @media (max-width: 950px) {
    width: 70px;
  }

  @media (max-width: 638px) {
    max-width: 100%;
    width: 240px;
  }
`;

const ButtonReset = styled.button`
  display: flex;
  padding: 12px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  width: 85px;
  height: 40px;
  max-width: 46%;
  border: 2px solid #ff5152;
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: #ff5152;
  background-color: #001832;

  &:hover {
    color: #fff;
    background-color: #ff5152;
  }

  @media (max-width: 950px) {
    width: 70px;
  }

  @media (max-width: 638px) {
    max-width: 100%;
    width: 240px;
  }
`;

const IconSpan = styled.span`
  &.fa-times:hover {
    color: #83bf46;
  }
`;
