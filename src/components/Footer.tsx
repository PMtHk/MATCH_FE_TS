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
}));

const FooterContents = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const FooterLogo = styled(Typography)(() => ({
  fontSize: 36,
  fontStyle: 'italic',
  fontWeight: 700,
  color: '#dddddd',
}));

const LinkList = styled(Box)(() => ({
  display: 'flex',
  gap: 45,
  alignItems: 'center',
  px: 4,
  mb: 2,
}));

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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
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
