import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2024 Marine Environment Monitoring. All rights reserved.</p>
      <p style={styles.text}>Contact Us: info@marineenvmonitoring.com</p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#024',
    color: 'white',
    textAlign: 'center',
    padding: '10px 20px',
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
  },
  text: {
    margin: '5px 0'
  }
};

export default Footer;
