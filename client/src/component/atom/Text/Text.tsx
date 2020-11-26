import React from 'react'
import styled from 'styled-components'
import colors from '@constant/color'
import { TextType } from '.'

const Text = ({
  customStyle = defaultStyle,
  children,
  onClick,
}: TextType.Props) => (
  <StyledText
    margin={customStyle.margin}
    padding={customStyle.padding}
    color={customStyle.color}
    fontSize={customStyle.fontSize}
    fontWeight={customStyle.fontWeight}
    display={customStyle.display}
    hover={customStyle.hover}
    onClick={onClick}
  >
    {children}
  </StyledText>
)

const defaultStyle: TextType.StyleAttributes = {
  margin: '0.3rem',
  padding: '0',
  color: '#000000',
  fontSize: '1rem',
  fontWeight: 'inherit',
  cursor: 'pointer',
  align: 'center',
  display: 'inline',
  hover: false,
}

const StyledText = styled.p<TextType.StyleAttributes>`
  margin: ${({ margin }) => margin};
  padding: ${({ padding }) => padding};
  color: ${({ color }) => (color ? colors.get(color) : defaultStyle.color)};
  font-size: ${({ fontSize }) => fontSize || defaultStyle.fontSize};
  font-weight: ${({ fontWeight }) => fontWeight || defaultStyle.fontWeight};
  cursor: ${({ cursor }) => cursor};
  &:hover {
    color: ${({ hover }) => hover && colors.get('blue')};
  }
  display: ${({ display }) => display || defaultStyle.display};
`

export default Text
