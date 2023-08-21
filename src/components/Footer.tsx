import React from 'react';

// mui
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <FooterWrapper>
      <Container maxWidth="md">
        <FooterTitle>
          <FooterLogo>MatchGG</FooterLogo>
        </FooterTitle>
        <FooterContents>
          <LinkList>
            <Link href="https://github.com/match-gg" color="#dddddd">
              GitHub
            </Link>
            <Link href="/" color="#dddddd">
              Notion
            </Link>
            <Link href="/" color="#dddddd">
              Discord
            </Link>
          </LinkList>
          <Typography color="#dddddd">
            2023 상명대학교 컴퓨터과학과 졸업 프로젝트
          </Typography>
          <Typography color="#dddddd">
            © 2023 MatchGG. All rights reserved.
          </Typography>
        </FooterContents>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;

const FooterWrapper = styled(Box)(() => ({
  width: '100%',
  padding: '28px 0px 48px',
  backgroundColor: '#3d3939',
})) as typeof Box;

const FooterTitle = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof Box;

const FooterContents = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: 2,
  gap: '12px',
})) as typeof Box;

const FooterLogo = styled(Typography)(() => ({
  fontSize: '40px',
  fontStyle: 'italic',
  fontWeight: 700,
  color: '#dddddd',
})) as typeof Typography;

const LinkList = styled(Box)(() => ({
  display: 'flex',
  gap: '40px',
  alignItems: 'center',
  px: 4,
  mb: 2,
})) as typeof Box;
