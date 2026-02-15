import { Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
  message: Yup.string().required('Message is required'), // Add validation rule for msg field
});

const CustomeTemplateForm = ({onSaveMessage, defultValue}) => {
  console.log(defultValue);
  const initialValues = {
    message: defultValue?.message, 
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      onSaveMessage(values);
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitting(false);
    }
  };

  return (
    <div className="BulkSmsSendItem boxShadow animate__animated animate__flipInX">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="BulkSmsItem" style={{ height: "100%" }}>
              <div className="customInput">
                <label style={{ fontWeight: "bold" }}>Enter Order Status Messages</label>
                <label><span style={{ fontWeight: "bold", color: "black" }}>Hint</span>{": Use these variables to personalize your sms: {customerName}, {break},  {orderNo}, {orderStatus}"}</label>
                <Field
                  as="textarea"
                  name="message"
                  rows="5"
                />
                <ErrorMessage name="msg" component="div" className="error" />
              </div>
            </div>

            <div className="duelButton">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CustomeTemplateForm;
