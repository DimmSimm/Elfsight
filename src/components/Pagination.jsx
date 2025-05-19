import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePage, fetchCharacters } from '../slices/charactersSlice';
import { useCallback } from 'react';

export function Pagination() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.characters);
  const { info, activePage, filters } = useSelector(
    (state) => state.characters
  );

  const pageClickHandler = useCallback(
    (pageIndex) => () => {
      dispatch(setActivePage(pageIndex));
      // Формируем URL с текущими фильтрами и выбранной страницей
      const url = new URL('https://rickandmortyapi.com/api/character/');
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
      url.searchParams.set('page', pageIndex + 1);
      dispatch(fetchCharacters(url.toString()));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [dispatch, filters]
  );

  if (error || !info.pages || info.pages <= 1) return null;

  // Создаем массив номеров страниц
  const pagesArray = Array.from({ length: info.pages }, (_, i) => i + 1);

  return (
    <StyledPagination>
      {pagesArray[activePage - 1] && (
        <>
          {activePage - 1 !== 0 && (
            <>
              <Page onClick={pageClickHandler(0)}>« First</Page>
              <Ellipsis>...</Ellipsis>
            </>
          )}

          <Page onClick={pageClickHandler(activePage - 1)}>{activePage}</Page>
        </>
      )}

      <Page active>{activePage + 1}</Page>

      {pagesArray[activePage + 1] && (
        <>
          <Page onClick={pageClickHandler(activePage + 1)}>
            {activePage + 2}
          </Page>

          {activePage + 1 !== pagesArray.length - 1 && (
            <>
              <Ellipsis>...</Ellipsis>
              <Page onClick={pageClickHandler(pagesArray.length - 1)}>
                Last »
              </Page>
            </>
          )}
        </>
      )}
    </StyledPagination>
  );
}

const StyledPagination = styled.div`
  width: 100%;
  text-align: center;
`;

const Page = styled.span`
  color: #fff;
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  transition: color 0.2s;
  ${({ active }) => active && 'color: #83bf46'};

  &:hover {
    color: #83bf46;
  }
`;

const Ellipsis = styled(Page)`
  cursor: default;

  &:hover {
    color: #fff;
  }
`;
