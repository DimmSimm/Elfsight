import styled from 'styled-components';
import { Pagination, ItemsGrid, Header } from './components';

export function App() {
  return (
    <Main>
      <Header />

      <>
        <ItemsGrid />

        <Pagination />
      </>
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px 0;
  max-width: 80%;
  margin: auto;

  @media (max-width: 1200px) {
    max-width: 95%;
  }

  @media (max-width: 930px) {
    max-width: 85%;
  }

  @media (max-width: 600px) {
    max-width: 90%;
  }
`;
