import "tailwindcss/tailwind.css";

export async function getServerSideProps(context: any) {
    const { req } = context;
    const sessionCookie = req.cookies["session"];
  
    if (!sessionCookie) {
      // Redirect to login if no session cookie
      return {
        redirect: {
          destination: "/Login",
          permanent: false,
        },
      };
    }
  
    // Pass session data to the page
    return { props: { sessionCookie } };
  }
  
const flowPage = ( { sessionCookie } : any) => {

    return(
        <>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="font-bold text-3xl">What do you wanna create ?</p>
              <input type="text" placeholder="A flying car" className="md:w-64" />
            </div>
        </>
    )

}


export default flowPage