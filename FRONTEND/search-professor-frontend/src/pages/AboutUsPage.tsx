function AboutUsPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
      color: '#333',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem 3rem',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        textAlign: 'center',
      }}>
        <h1 style={{ marginBottom: '1rem', color: '#6c63ff' }}>About Me</h1>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
          Hello! My name is <strong>Ayush Wosti</strong>. I am currently a student at 
          <strong> Islington College</strong> in Kathmandu, Nepal, pursuing a 
          <strong> BSc(Hons) Computing</strong> degree.  
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginTop: '1rem' }}>
          This is my personal page where I share a bit about myself. I am passionate about 
          technology, programming, and learning new skills in the field of computing. 
          My goal is to build projects that make a difference and continue growing as a developer.
        </p>
      </div>
    </div>
  );
}

export default AboutUsPage;
