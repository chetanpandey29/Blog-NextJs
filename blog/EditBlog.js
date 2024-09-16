import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Cookies, useCookies } from "react-cookie";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../../../middleware/API';
import JoditEditor from "jodit-react";
import Tagify from '@yaireo/tagify';
import EasyCrop from "./image-crop/EasyCrop";
import moment from 'moment';

// ================================|| EditBlog ||================================ //

const copyStringToClipboard = function (str) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const facilityMergeFields = [
  "FacilityNumber",
  "FacilityName",
  "Address",
  "MapCategory",
  "Latitude",
  "Longitude",
  "ReceivingPlant",
  "TrunkLine",
  "SiteElevation"
];
const inspectionMergeFields = [
  "InspectionCompleteDate",
  "InspectionEventType"
];
const createOptionGroupElement = (mergeFields, optionGrouplabel) => {
  let optionGroupElement = document.createElement("optgroup");
  optionGroupElement.setAttribute("label", optionGrouplabel);
  for (let index = 0; index < mergeFields.length; index++) {
    let optionElement = document.createElement("option");
    optionElement.setAttribute("class", "merge-field-select-option");
    optionElement.setAttribute("value", mergeFields[index]);
    optionElement.text = mergeFields[index];
    optionGroupElement.appendChild(optionElement);
  }
  return optionGroupElement;
}
const buttons = [
  "undo",
  "redo",
  "|",
  "bold",
  "strikethrough",
  "underline",
  "italic",
  "|",
  "superscript",
  "subscript",
  "|",
  "align",
  "|",
  "ul",
  "ol",
  "outdent",
  "indent",
  "|",
  "font",
  "fontsize",
  "brush",
  "paragraph",
  "|",
  "image",
  "link",
  "table",
  "|",
  "hr",
  "eraser",
  "copyformat",
  "|",
  "fullsize",
  "selectall",
  "print",
  "|",
  "source",
  "|",
  {
    name: "insertMergeField",
    tooltip: "Insert Merge Field",
    iconURL: "images/merge.png",
    popup: (editor, current, self, close) => {
      function onSelected(e) {
        let mergeField = e.target.value;
        if (mergeField) {
          console.log(mergeField);
          editor.selection.insertNode(
            editor.create.inside.fromHTML("{{" + mergeField + "}}")
          );
        }
      }
      let divElement = editor.create.div("merge-field-popup");

      let labelElement = document.createElement("label");
      labelElement.setAttribute("class", "merge-field-label");
      labelElement.text = 'Merge field: ';
      divElement.appendChild(labelElement);

      let selectElement = document.createElement("select");
      selectElement.setAttribute("class", "merge-field-select");
      selectElement.appendChild(createOptionGroupElement(facilityMergeFields, "Facility"));
      selectElement.appendChild(createOptionGroupElement(inspectionMergeFields, "Inspection"));
      selectElement.onchange = onSelected;
      divElement.appendChild(selectElement);

      console.log(divElement);
      return divElement;
    }
  },
  {
    name: "copyContent",
    tooltip: "Copy HTML to Clipboard",
    iconURL: "images/copy.png",
    exec: function (editor) {
      let html = editor.value;
      copyStringToClipboard(html);
    }
  }
];

const editorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  //defaultActionOnPaste: "insert_clear_html",
  buttons: buttons,
  uploader: {
    insertImageAsBase64URI: true
  }
};

function EditBlog() {
  var base64String = "";
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [Blogdata, setBlogData] = useState();
  const [Categorydata, setCategoryData] = useState();
  const [BlogTitle, SetBlogTitle] = useState("");                    // store the input values
  const [BlogSeoTitle, SetSeoTitle] = useState("");                  // store the input values
  const [BlogSlug, SetBlogSlug] = useState("");                      // store the input values
  const [BlogMetaDescription, SetMetaDescription] = useState("");    // store the input values
  const [CategoryId, SetCategoryId] = useState("");                  // store the input values
  const [BlogTags, SetBlogTags] = useState("");                      // store the input values
  const [BlogImage, SetBlogImage] = useState("");                    // store the input values
  const [BlogDescription, SetBlogDescription] = useState("");        // store the input values
  const [IsActive, SetIsActive] = useState("");                      // store the input values 
  const [ScheduleTime, SetScheduleTime] = useState();                // store the input values
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const cookies = new Cookies();
  const user = cookies.get('id');
  const croppedImage = cookies.get('croppedImage');
  const [cookie, removeCookie] = useCookies(['croppedImage']);

  useEffect(() => {
    getBlogById();
    getCategories();
  }, []);

  let blogdata = "";

  const getBlogById = async () => {
    try {
      var GetBlogByIdAPI = API.getBlogById;
      GetBlogByIdAPI = GetBlogByIdAPI + "?id=" + params.get("Id");
      const response = await fetch(GetBlogByIdAPI);
      const jsonData = await response.json();
      setBlogData(jsonData.recordset);
      console.log(Blogdata);
      blogdata = jsonData.recordset[0];
      SetBlogTitle(blogdata.BlogTitle);
      SetSeoTitle(blogdata.SeoTitle);
      SetBlogSlug(blogdata.BlogSlug);
      SetMetaDescription(blogdata.Meta_Description);
      SetCategoryId(blogdata.Category_Id);
      SetBlogTags(blogdata.BlogTages);
      SetBlogImage(blogdata.BlogImage);
      SetBlogDescription(blogdata.BlogDescription);
      SetScheduleTime(moment(blogdata.CreatedOn).zone('+00:00').format('YYYY-MM-DD HH:mm:ss'));
      SetIsActive(blogdata.IsActive);
    }
    catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      var GetCategoriesAPI = API.getActiveCategories;
      const response = await fetch(GetCategoriesAPI);
      const jsonData = await response.json();
      setCategoryData(jsonData.recordset);
      console.log(Categorydata);
    }
    catch (error) {
      console.log(error);
    }
  };

  var inputElem = document.getElementById('tag') // the 'input' element which will be transformed into a Tagify component
  var tagify = new Tagify(inputElem, {
  })

  const handleImageUpload = async (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const convertToSlug = function (str) {
    //replace all special characters | symbols with a space
    str = str.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ')
      .toLowerCase();

    // trim spaces at start and end of string
    str = str.replace(/^\s+|\s+$/gm, '');

    // replace space with dash/hyphen
    str = str.replace(/\s+/g, '-');
    SetBlogSlug(str);
    //return str;
  }

  const blobToBase64 = (url) => {
    return new Promise(async (resolve, _) => {
      // do a request to the blob uri
      const response = await fetch(url);

      // response has a method called .blob() to get the blob file
      const blob = await response.blob();

      // instantiate a file reader
      const fileReader = new FileReader();

      // read the file
      fileReader.readAsDataURL(blob);

      fileReader.onloadend = function () {
        resolve(fileReader.result); // Here is the base64 string
      }
    });
  };

  let submitHandler = async (e) => {
    e.preventDefault();
    if (image === null) {
      var checked = false;
      if (document.querySelector('#IsActive:checked')) {
        checked = true;
      }

      try {
        setLoading(true);
        var UpdateBlogAPI = API.updateBlog;
        UpdateBlogAPI = UpdateBlogAPI + "?id=" + params.get("Id");
        let res = await fetch(UpdateBlogAPI, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
          },
          json: true,
          body: JSON.stringify({
            title: BlogTitle,
            seoTitle: BlogSeoTitle,
            slug: BlogSlug,
            metaDescription: BlogMetaDescription,
            categoryId: CategoryId,
            tags: BlogTags,
            image: BlogImage,
            description: BlogDescription,
            createdOn: moment(ScheduleTime).zone('+05:30').format('YYYY-MM-DD HH:mm:ss'),
            modifiedBy: user,
            isActive: checked
          }),
        });
        let resJson = await res.json();
        if (resJson.status === 200) {
          SetBlogTitle("");
          SetSeoTitle("");
          SetBlogSlug("");
          SetMetaDescription("");
          SetCategoryId("");
          SetBlogTags("");
          SetBlogDescription("");
          SetIsActive("");
          removeCookie('croppedImage', '');
          setLoading(false);
        }
        else
          navigate('/admin/blogs');
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    else {
      if (image) {
        setImage("")
      }
      else {
        setLoading(true);
        var SignuploadformAPI = API.signuploadform;
        const signResponse = await fetch(SignuploadformAPI);
        const signData = await signResponse.json();
        const url = "https://api.cloudinary.com/v1_1/" + signData.cloudname + "/auto/upload";
        const urls = croppedImage;
        blobToBase64(urls)
          .then(base64String => {
            console.log(base64String);
          });
        const file = await blobToBase64(urls);
        const formData = new FormData();

        formData.append("file", file);
        formData.append("api_key", signData.apikey);
        formData.append("timestamp", signData.timestamp);
        formData.append("signature", signData.signature);
        formData.append("eager", "c_pad,h_300,w_400|c_crop,h_200,w_260");
        formData.append("folder", "website");

        const fileData = await fetch(url, {
          method: "POST",
          body: formData
        })
        const fileJson = await fileData.json();

        var checked = false;
        if (document.querySelector('#IsActive:checked')) {
          checked = true;
        }

        try {
          var UpdateBlogAPI = API.updateBlog;
          UpdateBlogAPI = UpdateBlogAPI + "?id=" + params.get("Id");
          let res = await fetch(UpdateBlogAPI, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json',
            },
            json: true,
            body: JSON.stringify({
              title: BlogTitle,
              seoTitle: BlogSeoTitle,
              slug: BlogSlug,
              metaDescription: BlogMetaDescription,
              categoryId: CategoryId,
              tags: BlogTags,
              image: fileJson.secure_url,
              description: BlogDescription,
              createdOn: moment(ScheduleTime).zone('+05:30').format('YYYY-MM-DD HH:mm:ss'),
              modifiedBy: user,
              isActive: checked
            }),
          });
          let resJson = await res.json();
          if (resJson.status === 200) {
            SetBlogTitle("");
            SetBlogSlug("");
            SetCategoryId("");
            SetBlogTags("");
            SetBlogDescription("");
            SetIsActive("");
            removeCookie('croppedImage', '');
            setLoading(false);
          }
          else
            navigate('/admin/blogs');
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Blog - The Bridge Code</title>
      </Helmet>
      {loading ?
        <>
          <div className="spinner">
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            <div>Loading...</div>
          </div>
        </> :
        <>
          <div className="container p-0">
            <div className="container row pt-5">
              <div className="col">
                <h3 className="card-header px-3 pb-3">Edit Blog Details</h3>
              </div>
              <div className="col" style={{ textAlign: "end" }}>
                <Link to='/admin/blogs' className="btn btn-info cl-button -primary">Back To List</Link>
              </div>
            </div>
            <div className='container mx-auto'>
              <div className="px-3 pb-3">
                <form className="pt-4" id='myform' onSubmit={submitHandler}>
                  <div className="form-item pb-4">
                    <input type="text" name="BlogTitle" id="BlogTitle" value={BlogTitle} onChange={(e) => SetBlogTitle(e.target.value)} required />
                    <label className='labe' >Title</label>
                  </div>
                  <div className="form-item pb-4">
                    <input type="text" name="SeoTitle" value={BlogSeoTitle} onChange={(e) => SetSeoTitle(e.target.value)} required />
                    <label className='labe' >SEO Title *</label>
                  </div>
                  <div className="form-item pb-4">
                    <input type="text" name="BlogSlug" id="BlogSlug" value={BlogSlug} onChange={(e) => SetBlogSlug(e.target.value)} required />
                    <label className='labe' >Slug *</label>
                  </div>
                  <div className="form-item pb-4">
                    <textarea type="text" name="MetaDescription" value={BlogMetaDescription} onChange={(e) => SetMetaDescription(e.target.value)} required />
                    <label className='labe' >Meta Description *</label>
                  </div>
                  <div className="form-item pb-4">
                    <select class="form-select form-select-lg mb-3" id='select' value={CategoryId} onChange={(e) => SetCategoryId(e.target.value)} required>
                      <option key="0" value="0">-- Select Category --</option>
                      {Categorydata && Categorydata.map((Categorydata) => (
                        <option key={Categorydata.Id} value={Categorydata.Id}>
                          {Categorydata.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-item pb-4">
                    <input type="text" id="tag" placeholder="Tags *" value={BlogTags} onChange={(e) => SetBlogTags(e.target.value)} />
                  </div>
                  <div className="row form-item pb-4">
                    <label className=''>Current Image:- </label>
                    <img src={BlogImage} className="col-md-1 thumbnail" />
                  </div>
                  <header className="App-headers">
                    <label className="_coverImage-holder">
                      Upload Feature Image
                      <input
                        type="file"
                        name="cover"
                        onChange={handleImageUpload}
                        accept="img/*"
                        style={{ display: "none" }}
                      />
                    </label>
                    <EasyCrop image={image} />
                  </header>
                  <div className="form-item pb-4">
                    <JoditEditor
                      value={BlogDescription}
                      config={editorConfig}
                      onChange={value => SetBlogDescription(value)}
                    />
                  </div>
                  <div className="form-check pb-4">
                    <input className="form-check-input" type="checkbox" name="IsActive" id="IsActive" onChange={() => SetIsActive(!IsActive)} checked={IsActive} />
                    <label className="form-check-label ms-1" for="flexCheckDefault">
                      Is-Active
                    </label>
                  </div>
                  <div className="form-item pb-4">
                    <input type="datetime-local" name="ScheduleTime" value={ScheduleTime} id="ScheduleTime" onChange={(e) => SetScheduleTime(e.target.value)} />
                  </div>
                  <input type="submit" value="Submit" className="cl-button -primary -small rounded-2 mt-2" />
                </form>
              </div>
            </div>
          </div>
        </>}

    </>
  );
};

export default EditBlog;
