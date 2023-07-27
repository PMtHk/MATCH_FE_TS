import React from 'react';

// mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// mui styled components
import { styled } from '@mui/system';

const FooterWrapper = styled(Box)(() => ({
  width: '100%',
  padding: '50px 0px 100px',
  backgroundColor: '#3d3939',
})) as typeof Box;

const FooterContents = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof Box;

const FooterLogo = styled(Typography)(() => ({
  fontSize: 36,
  fontStyle: 'italic',
  fontWeight: 700,
  color: '#dddddd',
})) as typeof Typography;

const LinkList = styled(Box)(() => ({
  display: 'flex',
  gap: 45,
  alignItems: 'center',
  px: 4,
  mb: 2,
})) as typeof Box;

const Footer = () => {
  return (
    <FooterWrapper>
      <Container maxWidth="md">
        <FooterContents>
          <FooterLogo>MatchGG</FooterLogo>
        </FooterContents>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            gap: 5,
          }}
        >
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
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
