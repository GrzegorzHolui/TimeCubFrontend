async function getUserCubes() {
  const url = "http://localhost:3000/get_user_cubes";
  const data = {
    token: token
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user cubes');
    }

    const userCubes = await response.json();

    // Mapujemy odpowiedź JSON tylko do potrzebnych pól
    const cubesData = userCubes.map(cube => ({
      Mac: cube.Mac,
      Cube_users_ID: cube.Cube_users_ID
    }));

    return cubesData;

  } catch (error) {
    console.error('Error fetching user cubes:', error);
    throw error; // Ponowne rzucenie błędu dla obsługi przez wywołującego
  }
}

async function saveTaskToServer(taskName) {
  const url = "http://localhost:3000/add_project";
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
  const url = "http://localhost:3000/set_project_active";
  const data = {
    token: token, project_id: projectId, cube_mac: cubeMac, cube_id: cubeId, side: wall
  };

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add project');
      }
      return response.json(); // Parse response as JSON
    })
    .then(json => {
      const projectId = json.ProjectID; // Extract ProjectID from the parsed JSON
      console.log('Project added successfully, ProjectID:', projectId);
      return projectId; // Return the ProjectID
    })
    .catch(error => {
      console.error('Error adding project:', error);
      throw error; // Re-throw the error so it can be handled by the caller
    });
}
