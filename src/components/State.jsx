export default function State() {

    function signup(formData) {
        
        const email = formData.get('email')
        console.log(email);
        
        
    }
    
    return (
        <section>
            <h1>Signup Form</h1>
            <form action={signup}>
                <label>Email:
                    <input
                        type="email"
                        name="email"
                        placeholder="e.g. John@gmail.com"
                    />
                </label><br />
                 <label>Password:
                    <input
                        type="password"
                        name="password"
                    />
                </label>
                <button>Submit</button>
            </form>
        </section>
    )
}