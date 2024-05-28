async function getUserCubes() {
  const url = link + "/get_user_cubes";
  console.log(url)
  const data = {
    token: token
  };

  try {
    const response = await fetch(url, {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user cubes');
    }

    const userCubes = await response.json();

    // Mapujemy odpowiedź JSON tylko do potrzebnych pól
    const cubesData = userCubes.map(cube => ({
      Mac: cube.Mac, Cube_users_ID: cube.Cube_users_ID
    }));

    return cubesData;

  } catch (error) {
    console.error('Error fetching user cubes:', error);
    throw error; // Ponowne rzucenie błędu dla obsługi przez wywołującego
  }
}

async function saveTaskToServer(taskName) {
  const url = link + "/add_project";
  const data = {
    token: token, name: taskName
  };

  try {
    const response = await fetch(url, {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to add project');
    }

    const responseData = await response.json();
    return {projectId: responseData.ProjectID}; // Assuming the response contains ProjectID
  } catch (error) {
    console.error('Error adding project:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}

async function setProjectActive(projectId, cubeId, cubeMac, wall) {
  const url = link + "/set_project_active";
  const data = {
    token: token, project_id: projectId, cube_mac: cubeMac, cube_id: cubeId, side: wall
  };

  try {
    const response = await fetch(url, {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonData = await response.json(); // Parse the response JSON

    console.log(jsonData)
    console.log(jsonData.success)
    console.log(jsonData.error)

    if (jsonData.success === false && jsonData.error === "Multiple projects on single cube's side") {
      console.log("Multiple projects on single cube's side");
      return false;
    } else {
      const projectId = jsonData.ProjectID; // Extract ProjectID from the parsed JSON
      console.log('Project added successfully, ProjectID:', projectId);
      return true; // Return the ProjectID
    }

  } catch (error) {
    console.error('Error adding project:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}


async function removeProject(project_id) {
  const url = link + "/remove_project";
  const data = {
    token: token, project_id: project_id
  };

  try {
    const response = await fetch(url, {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to add project');
    }

    const responseData = await response.json();
    return {projectId: responseData.ProjectID}; // Assuming the response contains ProjectID
  } catch (error) {
    console.error('Error adding project:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}

async function isTokenValid(token) {
  const url = link + "/get_user_cubes";
  const data = {
    token: token
  };

  try {
    const response = await fetch(url, {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (response.ok && responseData.success !== false) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}
