import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Popup } from './popup';
import { Card } from './card/Card';
import { useSelector } from 'react-redux';
import { Loader } from './common';
import { StyledCardTitle } from './card/CardTitle';

const defaultPopupSettings = {
  visible: false,
  content: {}
};

export function ItemsGrid() {
  const { characters, loading, error } = useSelector(
    (state) => state.characters
  );
  const [popupSettings, setPopupSettings] = useState(defaultPopupSettings);

  const cardOnClickHandler = useCallback(
    (props) => () => {
      setPopupSettings({
        visible: true,
        content: { ...props }
      });
    },
    []
  );

  if (loading) return <Loader />;
  if (error)
    return (
      <StyledCardTitle style={{ color: 'white' }}>
        No characters found
      </StyledCardTitle>
    );
  if (!characters.length && !loading)
    return (
      <StyledCardTitle style={{ color: 'white' }}>
        No characters found
      </StyledCardTitle>
    );

  return (
    <Container>
      {characters.map((props) => (
        <Card
          key={props.id}
          onClickHandler={cardOnClickHandler(props)}
          {...props}
        />
      ))}

      <Popup settings={popupSettings} setSettings={setPopupSettings} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  justify-items: center;
  gap: 30px;
`;
