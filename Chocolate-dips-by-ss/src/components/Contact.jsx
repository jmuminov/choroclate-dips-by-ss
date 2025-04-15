export default function Contact() {
    console.log("Contact rendered");
    return (
      <div className="contact-container">
      <h2>Send us a message</h2>
      <div className="contact-content">
        {/* Left side: Form */}
        <form className="contact-form">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Your Name" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Your Email" required />

          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" name="subject" placeholder="Subject" required />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>

          <button type="submit" className="contact-submit-button">Send</button>
        </form>

        {/* Right side: Instagram logo */}
        <div className="contact-instagram">
        <p>You can also reach us at Instagram:</p>
          <a href="https://www.instagram.com/chocolate_dipsby_ss" target="_blank" rel="noopener noreferrer">
            <img
              src="./images/instagram-logo.png"
              alt="Instagram"
              className="instagram-logo"
            />
          </a>
        </div>
      </div>
    </div>
    );
  }