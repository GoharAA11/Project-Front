import { MDBInput, MDBCardBody, MDBCard, MDBContainer, MDBRow, MDBCol, MDBCheckbox, MDBSwitch } from "mdb-react-ui-kit"
import { handleLogout, handleUpdateLogin, handleUpdatePass, verifyUser } from "../../../helpers/api"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { handleIsPrivate } from "../../../helpers/api"


export const Settings = () => {
    const [oldPassword, setOldPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [newLogin, setNewLogin] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [isPrivate, setIsPrivate] = useState<number>(0)
    const navigate = useNavigate()


    useEffect(() => {

        const PrivacySetting = async () => {
            const response = await verifyUser()
            if (response.user) {
                setIsPrivate(response.user.isPrivate)
            }
        }
        PrivacySetting()
    }, [])


    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const response = await handleUpdatePass({ old: oldPassword, newpwd: newPassword })

        if (response.status === "error" && response.message) {
            setError(response.message)
        } else {
            setError("")
            navigate("/login")
        }
    }
    const handleLoginChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await handleUpdateLogin({ password: oldPassword, login: newLogin })

        if (response.status === "error" && response.message) {
            setError(response.message)
        } else {
            setError("")
            navigate("/login")
        }
    }


    const handlePrivacyChange = async () => {

        const newPrivacyStatus = isPrivate === 0 ? 1 : 0
        const response = await handleIsPrivate({ isPrivate: newPrivacyStatus })

        if (response.status === "error" && response.message) {
            setError(response.message)
        } else {
            setIsPrivate(newPrivacyStatus)
            setError("")
        }
    }

    return (
        <MDBContainer fluid>
            <MDBRow className='d-flex justify-content-center align-items-center'>
                <MDBCol lg='8'>
                    <MDBCard className='my-5 rounded-3' style={{ maxWidth: '600px' }}>
                        <MDBCardBody className='px-5'>
                            <h1 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Settings</h1>

                            <h3>Account Privacy</h3>
                            <MDBSwitch
                                id='publicPrivateSwitch'
                                label={`This account is ${isPrivate === 1 ? 'Private' : 'Public'}`}
                                checked={isPrivate === 1}
                                onChange={handlePrivacyChange}
                            />







                            <h3>Password</h3>

                            <form onSubmit={handlePasswordChange}>
                                <MDBInput
                                    wrapperClass='mb-4'
                                    label='Old Password'
                                    type='password'
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                                <MDBInput
                                    wrapperClass='mb-4'
                                    label='New Password'
                                    type='password'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <button type='submit' className='btn btn-outline-success'>Change Password</button>
                            </form>

                            <h3>Login</h3>
                            <form onSubmit={handleLoginChange}>
                                <MDBInput
                                    wrapperClass='mb-4'
                                    label='Password'
                                    type='password'
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                                <MDBInput
                                    wrapperClass='mb-4'
                                    label='New Login'
                                    type='text'
                                    value={newLogin}
                                    onChange={(e) => setNewLogin(e.target.value)}
                                    required
                                />
                                <button type='submit' className='btn btn-outline-success'>Change Login</button>
                            </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}
