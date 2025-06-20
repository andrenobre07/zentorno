import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

// Adicionamos 'shippingAddress' às props que o nosso email recebe
export const ReceiptEmail = ({ customerEmail, totalAmount, car, shippingAddress }) => {
  const formattedPrice = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalAmount);

  return (
    <Html>
      <Head />
      <Preview>O seu recibo da Zentorno para o {car.nome}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://zentorno.vercel.app/logo.png"
            width="48"
            height="48"
            alt="Zentorno Logo"
            style={logo}
          />
          <Heading style={heading}>Obrigado pela sua compra!</Heading>
          <Text style={paragraph}>
            Olá,
          </Text>
          <Text style={paragraph}>
            Confirmamos a sua encomenda do seu novo **{car.nome}**. Este email serve como recibo do seu pagamento. Abaixo estão os detalhes da sua configuração e da morada de entrega.
          </Text>
          
          <Section style={detailsContainer}>
            <Row>
              <Column>
                <Text style={detailsTitle}>Detalhes da Encomenda</Text>
                <Text style={detailsItem}><strong>Modelo:</strong> {car.nome}</Text>
                <Text style={detailsItem}><strong>Cor:</strong> {car.color}</Text>
                <Text style={detailsItem}><strong>Interior:</strong> {car.interior}</Text>
                {car.packages && <Text style={detailsItem}><strong>Pacotes:</strong> {car.packages}</Text>}
              </Column>
            </Row>
          </Section>
          
          {/* --- NOVA SECÇÃO ADICIONADA AQUI --- */}
          {shippingAddress && (
            <Section style={detailsContainer}>
                <Text style={detailsTitle}>Endereço de entrega</Text>
                <Text style={detailsItem}>{shippingAddress.name}</Text>
                <Text style={detailsItem}>{shippingAddress.address.line1}</Text>
                {shippingAddress.address.line2 && <Text style={detailsItem}>{shippingAddress.address.line2}</Text>}
                <Text style={detailsItem}>{shippingAddress.address.postal_code}, {shippingAddress.address.city}</Text>
                <Text style={detailsItem}>{shippingAddress.address.country}</Text>
            </Section>
          )}

          <Section style={{ padding: '0 24px' }}>
            <Row>
                <Column>
                    <Text>Total Pago:</Text>
                </Column>
                <Column style={{textAlign: 'right'}}>
                    <Text style={totalPrice}>{formattedPrice}</Text>
                </Column>
            </Row>
          </Section>

          <Text style={paragraph}>
            A nossa equipa entrará em contato em breve para finalizar os próximos passos da entrega.
          </Text>
          <Text style={paragraph}>
            Com os melhores cumprimentos,<br />
            A Equipa Zentorno
          </Text>
          <Link href="http://localhost:3000" style={footerLink}>
            www.zentorno.com
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

export default ReceiptEmail;

// --- Estilos para o Email (sem alterações) ---
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};
const logo = {
  margin: '0 auto',
};
const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '24px',
  textAlign: 'center',
  padding: '0 24px',
};
const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left',
  padding: '0 24px',
};
const detailsContainer = {
  padding: '16px 24px',
  backgroundColor: '#f2f5f8',
  borderRadius: '4px',
  margin: '16px 24px',
};
const detailsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};
const detailsItem = {
    fontSize: '14px',
    lineHeight: '20px',
    margin: '4px 0',
};
const totalPrice = {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '0',
};
const footerLink = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center',
  display: 'block',
  marginTop: '24px',
};