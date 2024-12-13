import streamlit as st

import os

import base64

import requests

from dotenv import load_dotenv

from PIL import Image

from io import BytesIO



# Load environment variables

load_dotenv()



class ImageAnalyzer:

    def __init__(self):

        self.api_key = os.getenv("AZURE_OPENAI_KEY")

        self.endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")

        self.deployment_name = os.getenv("AZURE_DEPLOYMENT_NAME")

        self.api_version = "2024-02-15-preview"



    def encode_image(self, image):

        """Convert image to base64 string"""

        try:

            # Convert Streamlit uploaded image to PIL Image

            if not isinstance(image, Image.Image):

                image = Image.open(image)



            # Resize if image is too large

            max_size = (1500, 1500)

            if image.size[0] > max_size[0] or image.size[1] > max_size[1]:

                image.thumbnail(max_size, Image.Resampling.LANCZOS)

            

            # Convert to RGB if necessary

            if image.mode != 'RGB':

                image = image.convert('RGB')

            

            # Save to BytesIO

            buffered = BytesIO()

            image.save(buffered, format="JPEG")

            img_str = base64.b64encode(buffered.getvalue()).decode()

            return img_str

        except Exception as e:

            st.error(f"Error encoding image: {str(e)}")

            return None



    def analyze_image(self, image, prompt="What's in this image? Provide a detailed description."):

        """Analyze image using Azure OpenAI GPT-4 Vision"""

        try:

            # Encode image

            base64_image = self.encode_image(image)

            if not base64_image:

                return None



            # Prepare headers

            headers = {

                "api-key": self.api_key,

                "Content-Type": "application/json"

            }



            # Prepare payload

            payload = {

                "messages": [

                    {

                        "role": "user",

                        "content": [

                            {

                                "type": "text",

                                "text": prompt

                            },

                            {

                                "type": "image_url",

                                "image_url": {

                                    "url": f"data:image/jpeg;base64,{base64_image}"

                                }

                            }

                        ]

                    }

                ],

                "max_tokens": 500,

                "temperature": 0.7

            }



            # Make API request with progress bar

            with st.spinner("Analyzing image..."):

                response = requests.post(

                    f"{self.endpoint}/openai/deployments/{self.deployment_name}/chat/completions?api-version={self.api_version}",

                    headers=headers,

                    json=payload

                )



            # Check response

            if response.status_code == 200:

                return response.json()["choices"][0]["message"]["content"]

            else:

                st.error(f"API Error: {response.status_code} - {response.text}")

                return None



        except Exception as e:

            st.error(f"Error analyzing image: {str(e)}")

            return None



def main():

    st.set_page_config(

        page_title="Image Analysis with GPT-4 Vision",

        page_icon="🔍",

        layout="wide"

    )



    st.title("🖼️ Image Analysis with GPT-4 Vision")

    st.write("Upload an image and get AI-powered analysis")



    # Initialize analyzer

    analyzer = ImageAnalyzer()



    # Create two columns

    col1, col2 = st.columns([1, 1])



    with col1:

        # File uploader

        uploaded_file = st.file_uploader(

            "Choose an image...", 

            type=['png', 'jpg', 'jpeg'],

            help="Upload an image to analyze"

        )



        # Custom prompt input

        prompt = st.text_area(

            "Custom prompt (optional)", 

            value="What's in this image? Provide a detailed description.",

            help="Enter a specific question or prompt about the image"

        )



        # Analyze button

        analyze_button = st.button("Analyze Image", type="primary")



    # Display results in the second column

    with col2:

        if uploaded_file and analyze_button:

            # Display the uploaded image

            st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)

            

            # Analyze image

            result = analyzer.analyze_image(uploaded_file, prompt)

            

            if result:

                st.success("Analysis Complete!")

                st.markdown("### Analysis Result:")

                st.write(result)

                

                # Add download button for the analysis

                st.download_button(

                    label="Download Analysis",

                    data=result,

                    file_name="image_analysis.txt",

                    mime="text/plain"

                )



    # Add some helpful information at the bottom

    with st.expander("ℹ️ About this tool"):

        st.markdown("""

        This tool uses Azure OpenAI's GPT-4 Vision to analyze images. You can:

        - Upload any image (PNG, JPG, JPEG)

        - Ask specific questions about the image

        - Get detailed AI-powered analysis

        - Download the analysis results

        

        The analysis is performed in real-time and the results are not stored.

        """)



if __name__ == "__main__":

    main()


