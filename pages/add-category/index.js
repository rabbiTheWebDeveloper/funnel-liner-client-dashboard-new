import SubCategory from '../../Components/Category/SubCategoryPage/SubCategory';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>


            <SubCategory />

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});