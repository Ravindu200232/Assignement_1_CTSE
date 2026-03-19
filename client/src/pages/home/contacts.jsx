import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";
import Footer from "../../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);

  const fetchInquiries = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/inquiry`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInquiries(res.data || []);
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      Swal.fire("Error", "Please enter your message.", "warning");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:3000/api/inquiry`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success", "Your inquiry has been submitted.", "success");
      setMessage("");
      fetchInquiries(); // refresh inquiries list
    } catch (error) {
      console.error("Inquiry submission failed", error);
      Swal.fire("Error", "Please login first.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full min-h-screen flex items-center justify-center p-6 flex-col bg-primary">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl flex flex-col md:flex-row overflow-hidden mt-6 mb-10">
          {/* Left Section - Contact Info */}
          <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Feel free to use the form or drop us an email. Old-fashioned phone
              calls work too!
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <BiPhoneCall className="text-3xl text-accent mr-3" />
                <span className="text-lg font-semibold">0789840996</span>
              </div>

              <div className="flex items-center text-gray-700">
                <AiOutlineMail className="text-3xl text-accent mr-3" />
                <span className="text-lg font-semibold">
                  Ravindu2232@gmail.com
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <HiLocationMarker className="text-3xl text-accent mr-3" />
                <span className="text-lg font-semibold">
                  Kahatagasdigiliya, Anuradhapura
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Inquiry Form */}
          <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Get in Touch
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-3 rounded-lg hover:bg-blue-950 transition-all"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            {/* Inquiry List */}
            {inquiries.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                  Your Inquiries
                </h2>
                <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {inquiries.map((inq, idx) => (
                    <li
                      key={inq._id}
                      className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm"
                    >
                      <p className="text-gray-800 font-medium mb-1">Message:</p>
                      <textarea
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        value={inq.message}
                        onChange={(e) => {
                          const updated = [...inquiries];
                          updated[idx].message = e.target.value;
                          setInquiries(updated);
                        }}
                      />

                      <p className="text-gray-800 font-medium">Response:</p>
                      <p className="text-gray-600 italic mb-3">
                        {inq.response || "No response yet."}
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              const { message } = inquiries[idx];

                              if (!message.trim()) {
                                Swal.fire(
                                  "Warning",
                                  "Message cannot be empty.",
                                  "warning"
                                );
                                return;
                              }

                              await axios.put(
                                `http://localhost:3000/api/inquiry/${inq._id}`,
                                { message },
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );
                              Swal.fire(
                                "Success",
                                "Inquiry updated successfully.",
                                "success"
                              );
                              fetchInquiries();
                            } catch (err) {
                              console.error("Failed to update inquiry", err);
                              Swal.fire(
                                "Error",
                                "Failed to update inquiry.",
                                "error"
                              );
                            }
                          }}
                          className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-950"
                        >
                          Update
                        </button>

                        <button
                          onClick={async () => {
                            const confirmed = await Swal.fire({
                              title: "Are you sure?",
                              text: "This action cannot be undone.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, delete it!",
                            });

                            if (confirmed.isConfirmed) {
                              try {
                                const token = localStorage.getItem("token");
                                await axios.delete(
                                  `http://localhost:3000/api/inquiry/${inq._id}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                Swal.fire(
                                  "Deleted!",
                                  "Your inquiry has been removed.",
                                  "success"
                                );
                                fetchInquiries();
                              } catch (err) {
                                console.error("Failed to delete inquiry", err);
                                Swal.fire(
                                  "Error",
                                  "Failed to delete inquiry.",
                                  "error"
                                );
                              }
                            }
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
