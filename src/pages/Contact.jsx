import './Contact.css'
function Contact(){
    return(
        <div className='contact'>
            <form action="" id='contact-form'>
                <label htmlFor="name">Full Name:</label>
                <input type="text" name="name" id="name" required autoFocus/>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" required/>
                <label htmlFor="message">Message:</label>
                <textarea name="message" id="message" required></textarea>
                <input type="submit" value="Submit" id='submit' />
            </form>
        </div>
    )
}
export default Contact;