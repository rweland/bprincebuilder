import React from 'react';
import styled from 'styled-components';
import ThemeToggle from '../../ThemeToggle';

/**
 * Application header bar component that displays at the top of the application
 * @param {Object} props - Component props
 * @param {string} props.theme - Current theme ('light' or 'dark')
 */
const AppHeader = ({ theme }) => {
  return (
    <AppHeaderBar theme={theme}>
      <HeaderTitle>Blue Prince Floorplan Builder</HeaderTitle>
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>
    </AppHeaderBar>
  );
};

// Styled components
const AppHeaderBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${props => props.theme === 'dark' ? '#1a1a1a' : '#1976d2'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 0 20px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 42px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const ThemeToggleWrapper = styled.div`
`;

export default AppHeader;